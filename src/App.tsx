import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router basename="react-for-master">
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />}>
          <Route path=":id" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path=":id" element={<Search />} />
        </Route>
        <Route path="/" element={<Home />}>
          <Route path="movies/:id" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
