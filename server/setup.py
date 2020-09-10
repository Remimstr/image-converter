from setuptools import setup, find_packages

setup(
    name="Image Converter Server",
    version="1.0",
    packages=find_packages(),
    include_package_daa=True,
    zip_safe=False,
    install_requires=["Flask"]
)
