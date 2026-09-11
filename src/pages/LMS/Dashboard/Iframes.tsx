const Iframe = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title flex-grow-1 mb-0">Power BI</h4>
      </div>
      <div className="card-body">
        <iframe 
          title="liveworksheets" 
          width="100%" 
          height="628" 
          src="https://app.powerbi.com/view?r=eyJrIjoiZjhjZTJhOGYtZTNiMS00NDRlLTgwM2UtNDk5NDM1NGRlYWI4IiwidCI6ImIyYzk4MjZkLWFjOGUtNGQ4MC1hNmJiLTk0OGZiM2EzYzU4ZSJ9" 
          frameBorder="0" 
          allowFullScreen={true}>
        </iframe>
      </div>
    </div>
  );
};

export default Iframe;
