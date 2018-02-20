import { CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import config from "../config";

export async function authUser() {
  const currentUser = getCurrentUser();

  if (currentUser === null) {
    return false;
  }

  await getUserToken(currentUser);

  return true;
}

function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) {
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

export function changePassword(user, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    if(oldPassword == newPassword){
      reject('Error: New password is same as old password.');
      return;
    }
    user.changePassword(oldPassword, newPassword,function(err, result) {
      if (err) {
        reject(err);
        return;
      }
      resolve(console.log('call result: ' + result));
    });
  })
}

export function getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
    return userPool.getCurrentUser();
}

export function signOutUser() {
  const currentUser = getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }
}
