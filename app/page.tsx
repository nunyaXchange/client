import WalletConnect from "@/components/wallet-connect"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">NunyaXChange</h1>
        <p className="text-gray-400">The decentralized lending and borrowing platform</p>
      </div>
      <WalletConnect />
    </main>
  )
}
