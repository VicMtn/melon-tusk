const Faq = () => {
  const faqData = [
    {
      question: "Qu'est-ce qu'un portefeuille factice ?",
      answer:
        "Un portefeuille factice est une application ou un site qui imite le fonctionnement d'un portefeuille crypto sans être connecté à la blockchain. Ici, aucune vraie monnaie n'est échangée ou stockée ; tout est purement virtuel pour l'apprentissage ou la démonstration."
    },
    {
      question: "Pourquoi utiliser un portefeuille factice ?",
      answer:
        "Le but principal est de se familiariser avec l’interface et les fonctionnalités d’un portefeuille crypto sans prendre de risque financier. C’est idéal pour s’entraîner, apprendre les bases ou tester des stratégies de gestion de crypto-monnaies."
    },
    {
      question: "Comment créer un compte sur ce portefeuille factice ?",
      answer:
        "Il vous suffit de créer un identifiant et un mot de passe. Aucune vérification d’identité ou de moyen de paiement n’est nécessaire, puisque tout est faux. Nous vous conseillons toutefois d’utiliser un mot de passe sûr si vous souhaitez protéger votre compte de démonstration."
    },
    {
      question: "Est-ce que je peux échanger de vraies crypto-monnaies dessus ?",
      answer:
        "Non, ce service ne supporte aucune transaction réelle. Les soldes et les transactions que vous voyez sont purement fictifs et n’ont aucune valeur sur le marché."
    },
    {
      question: "Comment ajouter des fonds à mon portefeuille factice ?",
      answer:
        "Lorsque vous cliquez sur “Ajouter des fonds”, vous pouvez entrer n’importe quelle somme virtuelle pour mettre à jour votre solde. Cela n’affecte aucun compte bancaire ou carte de crédit ; tout reste dans le cadre de la simulation."
    },
    {
      question: "Puis-je transférer mes fonds factices vers un autre portefeuille ?",
      answer:
        "Non, cette fonctionnalité n’est pas disponible, car il n’y a pas d’intégration réelle avec la blockchain. Les transferts dans ce portefeuille restent internes et uniquement destinés à la simulation."
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
