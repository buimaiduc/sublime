import os
import time

import simplejson as json
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
from flask import Flask, request, Response, jsonify
from flask_pymongo import PyMongo

from api_exception import ApiException
from utils import generate_random_string, get_currency_exchange_rate

app = Flask(__name__)
# cors = CORS(app, resources={r"/*": {"origins": "*"}})

# logger = logging.getLogger()

app.config["MONGO_URI"] = "mongodb://localhost:27017/sublime"
mongo = PyMongo(app)

rpc_host = '127.0.0.1'
valid_currencies = ['GBP', 'USD', 'EUR', 'CHF', 'JPY', 'CNY']
rpc_port = 18888
rpc_user = 'user3'
rpc_password = 'password3'


def elements():
    try:
        rpc_connection = AuthServiceProxy("http://%s:%s@rpc_host:%s" % (rpc_user, rpc_password, rpc_port))

        result = rpc_connection.getwalletinfo()

    except JSONRPCException as json_exception:
        return "A JSON RPC Exception occured: " + str(json_exception)
    except Exception as general_exception:
        return "An Exception occured: " + str(general_exception)

    return Response(json.dump(result), mimetype='application/json')


@app.route('/accounts', methods=['POST'])
def create_account():
    account_request = {
        'email': request.get_json()['email'],
        'password': request.get_json()['password'],
        'party_id': request.get_json()['party_id']
    }

    account_collect = mongo.db.accounts
    account = account_collect.find_one({'email': account_request['email']})
    if account:
        raise ApiException('Account {} already existed'.format(account_request['email']))

    account_id = account_collect.insert(account_request)
    account_request['_id'] = str(account_id)

    return Response(json.dumps(account_request), mimetype='application/json')


@app.route('/account/<account_id>', methods=['GET'])
def get_account_by_id(account_id):
    account_collect = mongo.db.accounts
    account = account_collect.find_one({'_id': account_id})
    if account is None:
        raise ApiException('Account {} does not exist'.format(account_id))

    return account


@app.route('/account', methods=['POST'])
def get_account():
    account_request = {
        'email': request.get_json()['email'],
        'password': request.get_json()['password'],
    }

    account_collect = mongo.db.accounts
    new_session_id = generate_random_string(12)
    account = account_collect.find_and_modify(
        {'email': account_request['email'], 'password': account_request['password']},
        {'$set': {'session_id': new_session_id}}
    )
    if account is None:
        raise ApiException('Account credential {} is invalid'.format(account_request['email']), 401)

    account_request['id'] = str(account['_id'])
    account_request['session_id'] = str(new_session_id)

    return Response(json.dumps(account_request), mimetype='application/json')


@app.route('/account', methods=['GET'])
def get_account_with_session_id():
    session_id = request.args.get('session_id')
    account = get_current_account(session_id)
    party = get_current_party(account['party_id'])

    return Response(json.dumps(parse_account(account, party)), mimetype='application/json')


@app.route('/assets', methods=['GET'])
def get_assets():
    session_id = request.args.get('session_id')
    account = get_current_account(session_id)

    error, connection = get_rpc_connection(rpc_host,
                                           os.environ.get('user_%s' % account['party_id'], ''),
                                           os.environ.get('password_%s' % account['party_id'], ''),
                                           os.environ.get('port_%s' % account['party_id'], ''))
    if error is not None:
        return json.dumps(error)

    assets = []
    asset_labels = connection.dumpassetlabels()
    for currency in valid_currencies:
        if asset_labels.get(currency, None) is not None:
            assets.append({
                'id': currency,
                'hex': asset_labels[currency]
            })

    asset_balances = connection.getbalance()
    for asset in assets:
        if asset_balances.get(asset['id'], None) is not None:
            asset['amount'] = asset_balances[asset['id']]

    return Response(json.dumps({'assets': assets}), mimetype='application/json')


@app.route('/assets', methods=['POST'])
def create_asset():
    session_id = request.get_json()['session_id']
    asset_label = request.get_json()['asset_label']
    account = get_current_account(session_id)

    # get rpc connection to epiapi node
    error_epiapi, epiapi_connection = get_rpc_connection(rpc_host,
                                                         os.environ.get('user_epiapi', ''),
                                                         os.environ.get('password_epiapi', ''),
                                                         os.environ.get('port_epiapi', ''))
    if error_epiapi is not None:
        return json.dumps(error_epiapi)

    # validate requested asset token
    assets = epiapi_connection.listissuances()

    if is_asset_existed(asset_label, assets) is False:
        raise ApiException('Asset {} is not valid'.format(asset_label))

    # get rpc connection to party node
    party_error, party_connection = get_rpc_connection(rpc_host,
                                                       os.environ.get('user_%s' % account['party_id'], ''),
                                                       os.environ.get('password_%s' % account['party_id'], ''),
                                                       os.environ.get('port_%s' % account['party_id'], ''))

    if party_error is not None:
        return json.dumps(party_error)

    # send token from epiapi node to party node
    try:
        epiapi_connection.reissueasset(asset_label, 1000)
        epiapi_connection.generate(1)

        epiapi_connection.sendtoaddress(party_connection.getnewaddress(), 999, '', '', False, False, 1, 'UNSET',
                                        asset_label)
        epiapi_connection.generate(1)
    except Exception:
        raise ApiException('Error when issue a new asset')

    # wait for the balance got synced
    time.sleep(3)

    return Response(json.dumps(party_connection.getbalance()), mimetype='application/json')


@app.route('/transfers', methods=['POST'])
def create_transfer():
    session_id = request.get_json()['session_id']
    asset_amount = int(request.get_json()['asset_amount'])
    email = request.get_json()['email']

    # get source party
    source_account = get_current_account(session_id)
    source_party = get_current_party(source_account['party_id'])

    # get dest party
    account_collect = mongo.db.accounts
    dest_account = account_collect.find_one({'email': email})
    if dest_account is None:
        raise ApiException('Account not found', 404)

    dest_party = get_current_party(dest_account['party_id'])

    # get rpc connection to epiapi node
    error_epiapi, epiapi_connection = get_rpc_connection(rpc_host,
                                                         os.environ.get('user_epiapi', ''),
                                                         os.environ.get('password_epiapi', ''),
                                                         os.environ.get('port_epiapi', ''))

    if error_epiapi is not None:
        return json.dumps(error_epiapi)

    # validate requested asset token
    assets = epiapi_connection.listissuances()

    if is_asset_existed(dest_party['currency'], assets) is False:
        raise ApiException('Asset {} is not valid'.format(dest_party['currency']))

    # get rpc connection to party node
    source_party_error, source_party_connection = get_rpc_connection(rpc_host,
                                                                     os.environ.get(
                                                                         'user_%s' % source_account['party_id'], ''),
                                                                     os.environ.get(
                                                                         'password_%s' % source_account['party_id'],
                                                                         ''),
                                                                     os.environ.get(
                                                                         'port_%s' % source_account['party_id'], ''))

    dest_party_error, dest_party_connection = get_rpc_connection(rpc_host,
                                                                 os.environ.get('user_%s' % dest_account['party_id'],
                                                                                ''),
                                                                 os.environ.get(
                                                                     'password_%s' % dest_account['party_id'], ''),
                                                                 os.environ.get('port_%s' % dest_account['party_id'],
                                                                                ''))

    if source_party_error is not None:
        return json.dumps(source_party_error)

    if dest_party_error is not None:
        return json.dumps(dest_party_error)

    try:
        # get the transfer party 01 -> epiapi -> party 02
        source_party_connection.sendtoaddress(epiapi_connection.getnewaddress(), asset_amount, '', '', False, False, 1,
                                              'UNSET', source_party['currency'])
        source_party_connection.generate(1)

        # get the currency echange rate
        dest_amount = round(get_currency_exchange_rate(source_party['currency'], dest_party['currency']) * asset_amount)
        epiapi_connection.reissueasset(dest_party['currency'], dest_amount)
        epiapi_connection.generate(1)

        epiapi_connection.sendtoaddress(dest_party_connection.getnewaddress(), dest_amount, '', '', False, False, 1,
                                        'UNSET', dest_party['currency'])
        epiapi_connection.generate(1)
    except Exception:
        raise ApiException('Error when issue a new asset')

    # wait for the balance got synced
    time.sleep(3)

    return Response(json.dumps({'transactions': source_party_connection.listtransactions()}),
                    mimetype='application/json')


@app.route('/transfers', methods=['GET'])
def get_transfers():
    session_id = request.args.get('session_id')
    account = get_current_account(session_id)

    # get rpc connection to party node
    error, connection = get_rpc_connection(rpc_host,
                                           os.environ.get('user_%s' % account['party_id'], ''),
                                           os.environ.get('password_%s' % account['party_id'], ''),
                                           os.environ.get('port_%s' % account['party_id'], ''))

    transactions = connection.listtransactions()
    return Response(json.dumps({'transactions': transactions}), mimetype='application/json')


# ----------------------------------------------------------------------------------------------------------------------


# @app.route("/wallet", methods=['POST'])
# def get_wallet_info():
#     error, connection = extract_request_body(request.get_json())
#
#     if error is not None:
#         return json.dumps(error)
#
#     return Response(json.dumps(connection.getwalletinfo()), mimetype='application/json')


@app.route("/address", methods=['POST'])
def generate_new_address():
    error, connection = extract_request_body(request.get_json())

    if error is not None:
        return json.dumps(error)

    return Response(json.dumps({"address": connection.getnewaddress()}), mimetype='application/json')


@app.route("/transfer", methods=['POST'])
def transfer():
    body = request.get_json()
    error, connection = extract_request_body(request.get_json())

    if error is not None:
        return json.dumps(error)

    address = body.get('address', None)
    amount = body.get('amount', None)

    if address is None:
        return {'error': 'address is required'}
    if amount is None:
        return {'error': 'amount is required'}

    return Response(json.dumps({"txId": connection.sendtoaddress(address, amount)}), mimetype='application/json')


@app.route("/transfer_info", methods=['POST'])
def get_transfer():
    body = request.get_json()
    error, connection = extract_request_body(request.get_json())

    if error is not None:
        return json.dumps(error)

    tx_id = body.get('txId', None)
    if tx_id is None:
        return {'error': 'txId is required'}

    return Response(json.dumps(connection.gettransaction(tx_id)), mimetype='application/json')


def extract_request_body(body):
    error, rpc_user, rpc_password, rpc_port = verify_request_body(body)

    if error is not None:
        # logger.error(error)
        return error

    error, connection = get_rpc_connection(rpc_host, rpc_user, rpc_password, rpc_port)
    if error is not None:
        return error

    return None, connection


@app.errorhandler(ApiException)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


def is_asset_existed(asset_label, assets):
    for asset in assets:
        # make sure asset existed and got enough token
        if asset is not None and asset['assetlabel'] == asset_label:
            # and hasattr(asset, 'tokenamount') and int(asset['tokenamount']) != 0:
            return True

    return False


def get_current_account(session_id):
    account_collect = mongo.db.accounts

    account = account_collect.find_one({'session_id': session_id})
    if account is None:
        raise ApiException('Account not found', 404)

    return account


def get_current_party(party_id):
    party_collect = mongo.db.parties

    party = party_collect.find_one({'id': int(party_id)})
    if party is None:
        raise ApiException('Party not found', 404)

    return party


def get_rpc_connection(rpc_host, rpc_user, rpc_password, rpc_port):
    try:
        rpc_connection = AuthServiceProxy("http://%s:%s@%s:%s" % (rpc_user, rpc_password, rpc_host, rpc_port))

    except JSONRPCException as json_exception:
        return "A JSON RPC Exception occurred: " + str(json_exception)
    except Exception as general_exception:
        return "An Exception occurred: " + str(general_exception)

    return None, rpc_connection


def verify_request_body(body):
    rpc_user = body.get('user', None)
    rpc_password = body.get('password', None)
    rpc_port = body.get('port', None)

    if rpc_user is None:
        return {'error': 'user is required'}
    if rpc_password is None:
        return {'error': 'password is required'}
    if rpc_password is None:
        return {'error': 'port is required'}

    return None, rpc_user, rpc_password, rpc_port


def parse_account(account_values, party_values):
    return {
        'id': str(account_values['_id']),
        'email': account_values['email'],
        'password': account_values['password'],
        'session_id': account_values['session_id'],
        'party_id': account_values['party_id'],
        'currency': party_values['currency']
    }


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8089)
