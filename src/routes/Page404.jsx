import '../assets/css/pages/Page404.css'

const Page404 = () => {
    return (
        <div className="container">
            <section className="page_404">
                <div className="row">	
                    <div className="col-sm-12">
                        <div className="col-sm-10 col-sm-offset-1  text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>
                            </div>
                            <div className="contant_box_404">
                                <h3 className="h2">Parece que estás perdido</h3>
                                <p>¡La página que estás buscando no está disponible!</p>
                                <a href="/" className="link_404">Go to Home</a>
                            </div>
                        </div>
                    </div>
                </div>                
            </section>
        </div>
    )
}

export default Page404