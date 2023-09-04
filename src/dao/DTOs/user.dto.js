export default class UserDto {
    constructor(user) {
        this.name = `${user.first_name} ${user.last_name}`,
        this.age = user.age,
        this.email = user.email,
        this.cart = user.cart,
        this.role = user.role
    }
}