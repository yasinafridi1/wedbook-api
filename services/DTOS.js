class DTOS {
  userDto(user) {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      town: user.town,
      province: user.province,
      city: user.city,
    };
  }
}

module.exports = new DTOS();
