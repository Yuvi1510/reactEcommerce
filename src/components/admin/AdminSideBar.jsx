export default function AdminSideBar() {
    return (
        <div className=" w-64  h-screen border-r-1 bg-black fixed">
            <h1 className="text-2xl text-white font-bold p-4">Admin Panel</h1>  
            <ul className="p-4 text-white">
                <li>
                    <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li>
                    <a href="/admin/carousel">Carousel</a>
                </li>
                <li>
                    <a href="/admin/products">Products</a>
                </li>
                <li>
                    <a href="/admin/orders">Orders</a>
                </li>
                <li>
                    <a href="/admin/users">Users</a>
                </li>
            </ul>
        </div>
    )
}