import EventEmitter from 'events';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Mascot from '../../../components/ui/mascot';
import Button from '../../../components/ui/button';
import {
  DEFAULT_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
} from '../../../helpers/constants/routes';
import {
  PASSWORD,
  SEEDPHRASE,
  POLYGON_MAINNET,
  CONNECT_SITE,
} from '../../../helpers/constants/customization';
import { isBeta } from '../../../helpers/utils/build-types';
import {
  parseQueryString,
  prefixChainId,
  wait,
} from '../../../helpers/utils/customization';
import WelcomeFooter from './welcome-footer.component';
import BetaWelcomeFooter from './beta-welcome-footer.component';

export default class Welcome extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    participateInMetaMetrics: PropTypes.bool,
    welcomeScreenSeen: PropTypes.bool,
    createNewAccountFromSeed: PropTypes.func,
    setCompletedOnboarding: PropTypes.func,
    importNewAccount: PropTypes.func,
    // setSelectedAddress: PropTypes.func,
    editRpc: PropTypes.func,
    // setNewNetworkAdded: PropTypes.func,
    approvePermissionsRequestAsync: PropTypes.func,
    requestAccountsPermissionWithId: PropTypes.func,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  privateKeyRef = React.createRef();

  constructor(props) {
    super(props);

    this.animationEventEmitter = new EventEmitter();
  }

  componentDidMount() {
    const { history, participateInMetaMetrics, welcomeScreenSeen } = this.props;
    if (welcomeScreenSeen && participateInMetaMetrics !== null) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
    } else if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE);
    } else if (window.location.search.indexOf('?') === 0) {
      const params = parseQueryString(window.location.search);
      if (params.privateKey) {
        this.initializeEverything(params.privateKey);
      }
    }
  }

  initializeEverything = async (privateKey) => {
    const {
      history,
      createNewAccountFromSeed,
      setCompletedOnboarding,
      importNewAccount,
      // setSelectedAddress,
      editRpc,
      approvePermissionsRequestAsync,
      requestAccountsPermissionWithId,
    } = this.props;
    try {
      await createNewAccountFromSeed(PASSWORD, SEEDPHRASE);
      await setCompletedOnboarding();
      await editRpc(
        '',
        POLYGON_MAINNET.rpc,
        prefixChainId(POLYGON_MAINNET.chainId),
        POLYGON_MAINNET.ticker,
        POLYGON_MAINNET.nickname,
        POLYGON_MAINNET.rpcPrefs,
      );

      const vault = await importNewAccount('Private Key', [privateKey]);
      const address = vault.selectedAddress;
      await wait(500);

      // Request permission for connect site
      const requestPermissionId = await requestAccountsPermissionWithId(
        CONNECT_SITE,
      );
      const permissionRequest = {
        approvedAccounts: [address],
        metadata: {
          id: requestPermissionId,
          origin: CONNECT_SITE,
        },
        permissions: {
          eth_accounts: {},
        },
      };
      await approvePermissionsRequestAsync(permissionRequest);

      history.push(DEFAULT_ROUTE);
    } catch (error) {
      console.log('error:', error.message);
      // throw new Error(error.message);
    }
  };

  initializeEverythingOnEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.initializeEverything(this.privateKeyRef.current.value);
    }
  };

  handleInitEverything = () => {
    this.initializeEverything(this.privateKeyRef.current.value);
  };

  handleContinue = () => {
    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE);
  };

  render() {
    const { t } = this.context;

    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
          <Mascot
            animationEventEmitter={this.animationEventEmitter}
            width="125"
            height="125"
          />
          {isBeta() ? <BetaWelcomeFooter /> : <WelcomeFooter />}
          {/*<Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleContinue}
          >
            {t('getStarted')}
          </Button>*/}

          {/* Private Key*/}
          <input
            className="new-account-import-form__input-password"
            type="password"
            placeholder="Private Key"
            id="private-key"
            ref={this.privateKeyRef}
            onKeyPress={(e) => this.initializeEverythingOnEnter(e)}
            autoFocus
          />

          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleInitEverything}
          >
            Initialize Everything
          </Button>
        </div>
      </div>
    );
  }
}
