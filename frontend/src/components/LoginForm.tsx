export const LoginForm = () => {
    return (
        <>
            <form>
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" name="email" required></input>

                <label htmlFor="password">Password</label>
                <input type="text" id="password" name="password" required></input>

                <button type="submit">Log In</button>
            </form>
        </>
    )
}