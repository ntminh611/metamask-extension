import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import {
  closeWelcomeScreen,
  createNewVaultAndRestore,
  setCompletedOnboarding,
  importNewAccount,
  setSelectedAddress,
  editRpc,
  setNewNetworkAdded,
  requestAccountsPermissionWithId,
  approvePermissionsRequestAsync,
} from '../../../store/actions';
import Welcome from './welcome.component';

const mapStateToProps = ({ metamask }) => {
  const { welcomeScreenSeen, participateInMetaMetrics } = metamask;

  return {
    welcomeScreenSeen,
    participateInMetaMetrics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
    createNewAccountFromSeed: (password, seedPhrase) => {
      return dispatch(createNewVaultAndRestore(password, seedPhrase));
    },
    setCompletedOnboarding: () => dispatch(setCompletedOnboarding()),
    importNewAccount: (strategy, [privateKey]) => {
      return dispatch(importNewAccount(strategy, [privateKey]));
    },
    setSelectedAddress: (address) => dispatch(setSelectedAddress(address)),
    editRpc: (oldRpc, newRpc, chainId, ticker, nickname, rpcPrefs) =>
      dispatch(editRpc(oldRpc, newRpc, chainId, ticker, nickname, rpcPrefs)),
    setNewNetworkAdded: (networkName) =>
      dispatch(setNewNetworkAdded(networkName)),
    approvePermissionsRequestAsync: (request) =>
      dispatch(approvePermissionsRequestAsync(request)),
    requestAccountsPermissionWithId: (origin) =>
      dispatch(requestAccountsPermissionWithId(origin)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Welcome);
