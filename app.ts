import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LoginPage from './components/LoginPage';
import CombinedCsvAndSearchPage from './components/CombinedCsvAndSearchPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Login</Tab>
        <Tab disabled={!isAuthenticated}>Dashboard</Tab>
      </TabList>

      <TabPanel>
        <LoginPage onLoginSuccess={handleLogin} />
      </TabPanel>

      {isAuthenticated && (
        <TabPanel>
          <CombinedCsvAndSearchPage onLogout={handleLogout} />
        </TabPanel>
      )}
    </Tabs>
  );
}

export default App;
