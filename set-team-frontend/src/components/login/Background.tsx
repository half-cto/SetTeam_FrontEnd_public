const Background = () => {
    return (
        <div className="absolute w-screen h-full overflow-hidden">
            <div className="absolute top-36 left-40 w-80 h-80 bg-pink-400 rounded-2xl blur-xl z-0 opacity-90 filter mix-blend-multiply"></div>
            <div className="absolute top-60 left-80 w-60 h-60 bg-sky-400 rounded-2xl blur-sm filter mix-blend-multiply opacity-50 rotate-45 z-0"></div>
            <div className="absolute top-24 right-40 w-80 h-80 bg-gradient-to-r from-orange-300 to-pink-300 rounded-full mix-blend-multiply opacity-70 filter blur-md z-0"></div>
        </div>
    );
};

export default Background;
