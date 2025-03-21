function validateProfileEdit(req, res) {
  const editableFields = [
    "skills",
    "aboutMe",
    "avatar",
    "gender",
    "firstName",
    "lastName",
  ];

  const isEditAllowed = Object.keys(req.body).every((item) =>
    editableFields.includes(item)
  );

  return isEditAllowed;
}

function validateUserPasswordEdit(req, res) {
  const editableFields = ["currentPassword", "newPassword"];

  const isEditAllowed = Object.keys(req.body).every((item) =>
    editableFields.includes(item)
  );

  return isEditAllowed;
}

module.exports = { validateProfileEdit, validateUserPasswordEdit };
