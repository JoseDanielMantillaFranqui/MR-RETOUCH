import './App.css'
import Home from './screens/Home'
import Response from './screens/Response'
import Page404 from './screens/Page404'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
    return <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/response' element={<Response />} />
      <Route path='*' element={ <Page404 />} />
    </Routes>
  </Router>
}

export default App