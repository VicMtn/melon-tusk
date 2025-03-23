const Faq = () => {
  const faqData = [
    {
      question: "What is a mock wallet?",
      answer:
        "A mock wallet is an application or website that simulates the functioning of a crypto wallet without being connected to the blockchain. Here, no real money is exchanged or stored; everything is purely virtual for learning or demonstration purposes."
    },
    {
      question: "Why use a mock wallet?",
      answer:
        "The main purpose is to become familiar with the interface and features of a crypto wallet without taking any financial risk. It's ideal for practice, learning the basics, or testing cryptocurrency management strategies."
    },
    {
      question: "How do I create an account on this mock wallet?",
      answer:
        "You simply need to create a username and password. No identity verification or payment method is required, since everything is simulated. We do recommend using a secure password if you wish to protect your demo account."
    },
    {
      question: "Can I exchange real cryptocurrencies on it?",
      answer:
        "No, this service does not support any real transactions. The balances and transactions you see are purely fictional and have no market value."
    },
    {
      question: "How do I add funds to my mock wallet?",
      answer:
        "When you click on 'Add Funds', you can enter any virtual amount to update your balance. This doesn't affect any bank account or credit card; everything remains within the simulation framework."
    },
    {
      question: "Can I transfer my mock funds to another wallet?",
      answer:
        "No, this feature is not available as there is no real integration with the blockchain. Transfers in this wallet remain internal and are solely intended for simulation purposes."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FAQ - MelonTusk</h1>
      {faqData.map((item, index) => (
        <div className="card mb-4" key={index}>
          <div className="card-body">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faq;
