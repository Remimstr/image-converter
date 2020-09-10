# Instructions for running the server
- `cd` into the server directory
- Make a new virtual environment and run `pip install`

## Quickstart in development mode
- Run with `flask run`

## To make a production build
- Make a production build by running `python setup.py bdist_wheel`
- Install the new app `pip install dist/*.whl`
- I'm not entirely sure how to run the production build

# Instructions for running the client
- `cd` into the client directory
- Run `yarn`

## Quickstart in development mode
- Set the `API_BASE_URL` environment variable if necessary
- Run the app! `yarn start`

## To make a production build
- Build the app! `yarn build`

