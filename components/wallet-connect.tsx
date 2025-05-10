"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wallet, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function WalletConnect() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true)

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined") {
      setIsMetaMaskInstalled(!!window.ethereum)
    }
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected", {
        description: "Please install MetaMask to continue",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        toast.success("Wallet connected", {
          description: `Connected to ${shortenAddress(accounts[0])}`,
        })

        // Redirect to order form after successful connection
        setTimeout(() => {
          router.push("/create-order")
        }, 1000)
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast.error("Failed to connect wallet", {
        description: error.message || "Please try again",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Card className="border-gray-800 bg-gray-950 text-white shadow-lg w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl text-purple-400">NunyaXChange</CardTitle>
        <CardDescription className="text-gray-400">Connect your wallet to start lending and borrowing</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <div className="bg-gray-800 rounded-full p-6 mb-6">
          <Wallet className="h-12 w-12 text-purple-400" />
        </div>

        {!isMetaMaskInstalled ? (
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium mb-2">MetaMask Not Detected</h3>
            <p className="text-gray-400 mb-4">Please install MetaMask to use this application</p>
            <Button
              onClick={() => window.open("https://metamask.io/download/", "_blank")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Install MetaMask
            </Button>
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-purple-600 hover:bg-purple-700 w-full"
            size="lg"
          >
            {isConnecting ? (
              <>Connecting...</>
            ) : account ? (
              <>
                Connected: {shortenAddress(account)} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>Connect Wallet</>
            )}
          </Button>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-800 bg-gray-900/50 flex justify-center">
        <p className="text-xs text-gray-400">NunyaXChange - All Rights Reserved.</p>
      </CardFooter>
    </Card>
  )
}
