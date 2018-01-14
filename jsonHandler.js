var envJson = "./env.json";
var fs = require("fs");
var file = require(envJson);
var jsonHandler = {};

jsonHandler.addUser = function(userName, envName, response) {

    var resultIndex = findEnv(envName);

    if(resultIndex === -1) {
        response("Sorry, did not see that environment in the list. " +
            "Please use `/list` to see which envs are registered for your team");
    } else {
        if(file.env[resultIndex].user !== "") {
            if(file.env[resultIndex].user === userName) {
                response("Such a workaholic you are!" +
                    " unfortunately you can only take it once tho :P")
            } else {
                response("Sorry, <@" + file.env[resultIndex].user + "> currently has that env. Why don't you " +
                    "politely go poke them or message them to see if you can have it!")
            }
        } else {
            file.env[resultIndex].user = userName;
            fs.writeFile(envJson, JSON.stringify(file, null, 2), function() {
                response("You are now the proud owner of `" + envName + "`!!")
            });
        }
    }
};

jsonHandler.releaseUser = function(userName, envName, response) {

    var resultIndex = findEnv(envName);

    if(resultIndex === -1) {
        response("Sorry, did not findEnv that env. Please use `/list` to see which envs are available for use")
    } else {
        if(file.env[resultIndex].user === "") {
            response("Uhhh...you already released it?? The username for that json.envName is an empty string :/")
        } else {
              if(file.env[resultIndex].user !== userName) {
                  response("That environment belongs to `" + file.env[resultIndex].user + "`! Shame on you...shaaaammeee!!")
              } 
              else {
                  file.env[resultIndex].user = "";
                  fs.writeFile(envJson, JSON.stringify(file, String, 2), function() {
                      response("Goodbye `" + envName + "`. It was nice knowing you!.")
                  });
              }
          }
      }
};

jsonHandler.addEnv = function(userName, envName, response) {

  var resultIndex = findEnv(envName);

  if(resultIndex !== -1) {
    response("The environment already exists, cannot add it twice")
  } else {
    file.env.push({"name": "" + envName + "","user": ""})
    fs.writeFile(envJson, JSON.stringify(file, String, 2), function() {
      response("<@" + userName + "> has sucessfully added environment `" + envName + "` to the list of environments. Congrats. You like to work hard!")
    });
  }
}

jsonHandler.listAvailable = function () {
    var myCriteria = {"user": ""};
    var results = file.env.filter(function (name) {
        return Object.keys(myCriteria).every(function(c) {
            return name[c] === myCriteria[c]
        })
    });

    var resultString = "";
    results.forEach(function (env) {
        resultString += "`" + env.name + "` "
    });
    return resultString;
};

jsonHandler.listAll = function () {
    var resultString = "";
    file.env.forEach(function (env) {
        resultString += "`" + env.name + "` "
    });
    return resultString;
};

findEnv = function (envName) {
    return file.env.findIndex(function (entry) {
        return entry.name === envName;
    });
};

module.exports = jsonHandler;
