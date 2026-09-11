const Iframe = () => {
  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
      <div className="tw-py-2 tw-px-4 tw-border-b">
        <h4 className="tw-text-base tw-font-semibold tw-mb-0">Power BI</h4>
      </div>
      <div className="card-body">
        <iframe
          title="Transport report"
          width="100%"
          height="628"
          src="https://app.powerbi.com/view?r=eyJrIjoiYmU2ZmNiNzgtMTdiNi00NjhhLWJkNzgtYWIyZDUyOTEzYjE3IiwidCI6ImIyYzk4MjZkLWFjOGUtNGQ4MC1hNmJiLTk0OGZiM2EzYzU4ZSJ9"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default Iframe;
