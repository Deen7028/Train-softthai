import LoginForm from "../components/auth/LoginForm";
import Footer from "../components/footer/page";
import Navbar from "../components/navbar/page";

export default function Page() {
    return (
        <>
            <Navbar />
            <main>
                <LoginForm />
            </main>
            <Footer />

        </>

    );
}
