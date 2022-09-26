The Unofficial PSM3 User's Guide
================================

This website is a source of information about data from the
`Physical Solar Model v3 <https://nsrdb.nrel.gov/data-sets/us-data>`_ dataset,
part of the National Solar Radiation Database (`NSRDB <https://nsrdb.nrel.gov/>`_),
a free and public irradiance and meteorological database
from the National Renewable Energy Laboratory (`NREL <https://www.nrel.gov/>`_).
However, this project is not directly affiliated with or endorsed by the NSRDB team
or NREL.  As such, the information here should not be considered official documentation.
Rather, it is a user-developed effort to document and demonstrate aspects of
the PSM3 dataset and web API that are not necessarily documented anywhere else.

This website follows an open data-driven approach: all claims are drawn
from open and reproducible code-based analysis of data retrieved from the NSRDB.
That means that you can verify the claims by running the code yourself.
However, it also means that the claims have an unknown shelf life;
because the NSRDB can change at any time, so might the results of this
website's analysis.  Every webpage has a "last updated" watermark to document
the data retrieval and analysis date.  Where relevant, every webpage also
includes a record of changes to its content.

Credits
-------
Free and open-source software is a key enabler of modern scientific computing.
This project uses many open-source software packages, including:

- `pvlib <https://pvlib-python.readthedocs.io>`_: retrieving PSM3 data and solar/irradiance modeling
- `cartopy <https://scitools.org.uk/cartopy/docs/latest/>`_: mapping
- `matplotlib <https://matplotlib.org/>`_: plotting
- `pandas <https://pandas.pydata.org/docs>`_ and `numpy <https://numpy.org/doc/stable/>`_: number crunching
- `sphinx <https://www.sphinx-doc.org>`_ and `jupyter <https://jupyter.org/>`_: building the website
- `python <https://www.python.org>`_: the foundation of all of the above
- and many others


.. toctree::
   :maxdepth: 2
   :caption: Contents:

   pages/cloudy-disc
   pages/data-aggregation
   pages/hsds-auxiliary
   pages/rate-limits
   pages/rollover
   pages/solar-position
   pages/spatial-extent


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
