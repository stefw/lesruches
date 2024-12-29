# Les Ruches

Un site web construit avec Quarto présentant la synthèse de "Comment fabriquer une guillotine" de Juan Branco.

## Fonctionnalités

- Site web statique généré avec Quarto
- Navigation structurée par sections thématiques
- Présentation claire des mesures et réformes
- Style personnalisé avec SCSS/CSS

## Prérequis

- Quarto
- Python 3.8 ou supérieur (pour les scripts utilitaires)
- Un navigateur web moderne

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/stefw/lesruches.git
cd branco
```

2. Installez Quarto si ce n'est pas déjà fait :
Visitez [quarto.org](https://quarto.org) pour les instructions d'installation.

## Utilisation

### Développement local

1. Lancez le serveur de développement Quarto :
```bash
quarto preview
```

2. Ouvrez votre navigateur à l'adresse indiquée (généralement http://localhost:4200)

### Structure du projet

```
branco/
├── _quarto.yml       # Configuration Quarto
├── index.qmd         # Page d'accueil
├── custom.scss       # Styles personnalisés
├── styles.css        # Styles additionnels
├── pages/           # Pages de contenu
│   ├── construire.qmd
│   ├── institutions.qmd
│   ├── economie.qmd
│   └── ...
└── docs/            # Site généré
```

### Modification du contenu

- Les fichiers `.qmd` contiennent le contenu en format Quarto/Markdown
- Le style peut être personnalisé via `custom.scss` et `styles.css`
- La configuration du site se trouve dans `_quarto.yml`

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre contribution (`git checkout -b feature/NouvelleMesure`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle mesure'`)
4. Poussez vers la branche (`git push origin feature/NouvelleMesure`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous [licence MIT](LICENSE) - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion :
- Ouvrez une issue sur GitHub
- Contactez les mainteneurs du projet via GitHub
