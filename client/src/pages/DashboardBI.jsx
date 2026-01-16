import React from 'react';

const DashboardBI = () => {
    // Note: Pour afficher votre rapport Power BI, vous devez d'abord le publier sur Power BI Service 
    // et obtenir un lien "Publier sur le Web" ou un code d'intégration (iframe).
    // Remplacez l'URL ci-dessous par votre lien d'intégration réel.
    const biEmbedUrl = "https://app.powerbi.com/view?r=eyJrIjoiMmE0MTlkNWEtZDRkMC00ZWZjLTgzNzMtYzM0NzJmMDEzMWU1IiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9";

    return (
        <div className="bi-dashboard-container">
            <div className="page-header">
                <h1 className="page-title">
                    <span className="gradient-text">Power BI</span> Analytics
                </h1>
                <p className="page-subtitle">
                    Visualisations avancées et analyses financières en temps réel.
                </p>
            </div>

            <div className="bi-frame-wrapper">
                <iframe
                    title="SmartWallet BI Analytics"
                    width="100%"
                    height="600"
                    src={biEmbedUrl}
                    frameBorder="0"
                    allowFullScreen={true}
                ></iframe>
            </div>

            <div className="bi-instructions">
                <h3>💡 Comment mettre à jour ce rapport ?</h3>
                <p>
                    Pour afficher votre propre rapport personnalisé :
                    <ol>
                        <li>Ouvrez votre fichier dans <strong>Power BI Desktop</strong>.</li>
                        <li>Cliquez sur <strong>Publier</strong> vers Power BI Service.</li>
                        <li>Dans Power BI Service, allez dans <i>Fichier {'>'} Intégrer le rapport {'>'} Publier sur le Web</i>.</li>
                        <li>Copiez l'URL et remplacez-la dans le fichier <code>DashboardBI.jsx</code>.</li>
                    </ol>
                </p>
            </div>
        </div>
    );
};

export default DashboardBI;
