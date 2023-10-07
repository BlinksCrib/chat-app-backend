const createTokenUser = (user) => {
  return {
    userId: user._id,
    email: user.email,
    phoneNumber: user.phoneNumber,
    fName: user.fName,
    lName: user.lName,
    profileImage: user.profileImage,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    school: user.school,
  }
}

export default createTokenUser
