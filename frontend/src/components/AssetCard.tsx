const AssetCard = () => {
  return (
    <div className="card bg-orange-400/60 glass w-full sm:w-1/3">
            <div className="card-body">
              <div className="text-base-content/50 mb-3">My total assets</div>
              <div className="text-4xl mb-4">3538.45$</div>
              <div className="card-actions">
                <a href="/assets" className="link link-primary no-underline">
                  Go to assets
                </a>
              </div>
            </div>
          </div>
  )
}

export default AssetCard;