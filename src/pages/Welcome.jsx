import Button from "../componets/button";
import welcomeImg from "../assets/clothes.png";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col justify-end max-w-sm mx-auto">
      <div className="relative z-20">
      </div>
      <img
        src={welcomeImg}
        alt="Clothes"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black opacity-30 z-0" />
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />
      {/* Bottom content */}
      <div className="relative z-20 flex flex-col items-center justify-end flex-1 pb-8 h-full">
        <div className="mb-30 text-center">
          <h1 className="text-white text-3xl font-medium mb-2 drop-shadow-lg">
            You want <br /> Authentic, here  <br /> you go!
          </h1>
          <p className="text-gray-200 text-base font-normal drop-shadow-lg">
            Find it here, buy it now!
          </p>
        </div>
        <div className="w-full px-4">
          <Button onClick={() => navigate("/onboarding")}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
