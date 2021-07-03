import AuthService from './service';
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction}next
 * @param {IUserModel} user
 * @param {string} resMessage
 */
function passportUserFindOrCreate(body: any): void {
  const user: any = {
    profile: {
      login_id: body.login_id,
      first_name: body.first_name,
      last_name: body.last_name,
      git_repo: body.git_repo,
      is_active: body.is_active,
      avatar_url: body.avatar_url,
    },
    provider: {
      name: 'github',
    },
  };

  AuthService.findProfileOrCreate(user);
}
