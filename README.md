# Vinlotteri

This project is based of the template for ASP.NET Core Web app with React.js, [read more here](https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-react?view=vs-2022).
It uses Azure App Service to host the app with SpaProxy for frontend hosting. With a PostgreSQL instance running in CosmosDb.

The web app is running on https://vinlotteri-1234.azurewebsites.net/

### What has (not) been done?

The task was to implement a fullstack vinlotteri app with focus on the backend, preferably in about two hours. 

#### Because of the time constraint some corners have been cut:

- There is no CQRS and no domain layer. The database is accessed directly from the controller, this creates tight coupling resulting in e.g. the impossibility of good unit testing. This is something I normally would have implemented, but I want to respect the constrain, and would rather talk through this design pattern during the interview.
- Testing, I would argue lack of testing is reasonable given the constraints.
- The task specified that not all features needed to be implemented. Therefore I have not focused on the economical side, nor on the actual wine part of the lottery. I had an idea of faking a service for calling Vinmonopolet APIs to get "random" wine in different price classes.
- No data validation, so the requirement for having tickets be in 1 - 100 range is ignored.

##### So, what has actually been done then?

- Have set up a Azure App Service, Cosmos Db running PostgreSQL (because I'm most familiar with that).
- An ASP.NET application commanding and querying the database from the controller, and not much else.
- A React frontend, displaying tickets and users.

~~PS. There db secret is in this repo, I had some problem using Configurations from App Service to read the connection string in the app, so I gave up on that.~~