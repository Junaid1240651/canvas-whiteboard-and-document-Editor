import ReactLoading from "react-loading";
import "./LoadingScreen.css";
const LoadingScreen = () => {
  return (
    <div className="App">
      <ReactLoading type={"bars"} color={"#03fc4e"} height={100} width={100} />
    </div>
  );
};

export default LoadingScreen;
