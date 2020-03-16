import React from 'react';
import './App.css';
import Login from './components/Login';
import SideMenu from './components/SideMenu';
import List from './components/List';
import ManageAccounts from './components/ManageAccounts';
class App extends React.Component {
  render() {
  return (
    <div className="App">
      <header className="App-header">
        <ManageAccounts />

        <SideMenu />
      </header>
    </div>
  );
}
}

export default App;
