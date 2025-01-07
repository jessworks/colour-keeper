export const CreateAccountForm = () => {
    return (
        <>
            <form>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required></input>

                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" name="email" required></input>

                <label htmlFor="password">Password</label>
                <input type="text" id="password" name="password" required></input>

                <button type="submit">Create Account</button>
            </form>
        </>
    )
}