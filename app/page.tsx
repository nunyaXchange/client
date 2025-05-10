import OrderForm from "@/components/order-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">Create Order</h1>
        <OrderForm />
      </div>
    </main>
  )
}
