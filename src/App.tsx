import { BottomBar, Nav, TimerContainer } from "./components";

function App() {
  return (
    <div className="background w-screen h-screen">
      <div className="flex flex-col items-center justify-center w-full h-full bg-black/15 backdrop-blur-[2.5px] p-2.5">
        <Nav />
        <div className="flex items-center justify-center w-full h-full">
          <TimerContainer />
        </div>
        <BottomBar />
      </div>
    </div>
  );
}

export default App;
