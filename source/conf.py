# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "The Unofficial PSM3 User's Guide"
copyright = '2022'
author = 'The Assessing Solar Community'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'nbsphinx',
    'sphinxcontrib.bibtex',
]

templates_path = ['_templates']
exclude_patterns = []

nbsphinx_execute = 'never'
nbsphinx_requirejs_path = ''  # disable requirejs; already loaded by theme

# https://sphinxcontrib-bibtex.readthedocs.io/en/latest/usage.html#configuration
bibtex_default_style = 'plain'
bibtex_reference_style = 'label'
bibtex_bibfiles = ['references.bib']

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_book_theme'
html_static_path = ['_static']
html_title = "Unofficial PSM3 User's Guide"

html_theme_options = {
    "repository_url": "https://github.com/AssessingSolar/unofficial-psm3-userguide",
    "use_repository_button": True,
}
