const Masthead: React.FC = () => {
  return (
    <header className="bg-gray-100">
      <div className="container">
        <div className="flex flex-wrap py-0.5">
          <a
            className="no-underline text-black hover:text-black cursor-pointer"
            href="https://www.gov.sg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/crest.svg"
              alt="Singapore lion head symbol"
              width="14"
              height="14"
              className="inline-block align-middle"
            />
            <span className="text-sm pl-2">A Singapore Government Agency Website</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Masthead;

/* <header id="sgds-masthead" className="sgds-masthead">
    <div className="container">
      <div className="flex flex-wrap">
        <div className="w-full">
          <a href="https://www.gov.sg" target="_blank" rel="noopener noreferrer">
            <span className="sgds-icon sgds-icon-sg-crest" />
            <span className="is-text">A Singapore Government Agency Website</span>
          </a>
        </div>
      </div>
    </div>
  </header> */
