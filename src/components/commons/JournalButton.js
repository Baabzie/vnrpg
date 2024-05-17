const JournalButton = ({ setActiveJournal }) => {
  const handleClick = () => {
    setActiveJournal(true);
  };
  return (
    <button onClick={() => handleClick()}>
      <p>Open Journal</p>
    </button>
  );
};

export default JournalButton;
