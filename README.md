# Iyin Sopeyin — Portfolio

A personal portfolio site written in plain HTML and CSS, with a small JavaScript file for the menu. Each project links to a case study.

## Structure

```
index.html        the home page (GitHub Pages serves this automatically)
projects/         one case-study page per project
css/styles.css    all styles, shared by every page
js/main.js        opens and closes the phone menu
images/           portrait and project screenshots
files/            résumé PDF
```

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server
```

## Publish with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. The site appears at `https://<your-username>.github.io/<repo-name>/`.
   If you name the repository `<your-username>.github.io`, it appears at `https://<your-username>.github.io/`.
