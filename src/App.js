import Dashboard from './pages/Dashboard';
import VaultFactory from './pages/VaultFactory';
import Vault from './pages/Vault';
import Transactions from './pages/Transactions';
import Staking from './pages/Staking';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/staking" component={Staking} />
                <Route
                    exact
                    path="/vaultFactory/:vaultFactory"
                    component={(props) => <VaultFactory vaultFactory={props.match.params.vaultFactory} />}
                />
                <Route
                    exact
                    path="/vault/:vaultFactory/:vaultId"
                    component={(props) => <Vault vaultFactory={props.match.params.vaultFactory} vaultId={props.match.params.vaultId} />}
                />
                <Route
                    exact
                    path="/transactions/:vaultFactory/:vaultId"
                    component={(props) => (
                        <Transactions vaultFactory={props.match.params.vaultFactory} vaultId={props.match.params.vaultId} />
                    )}
                />
                <Route>No such path defined</Route>
            </Switch>
        </Router>
    );
}

export default App;
