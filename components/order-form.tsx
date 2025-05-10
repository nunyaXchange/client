"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Order, OrderType } from "@/lib/types"

// Interface for form state (different from final Order object)
interface OrderFormState {
  orderType: OrderType
  amount: string
  collateral: string
  vtlMin: string
  vtlMax: string
}

export default function OrderForm() {
  const router = useRouter()
  const [formState, setFormState] = useState<OrderFormState>({
    orderType: "lend",
    amount: "",
    collateral: "",
    vtlMin: "",
    vtlMax: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    // Check if wallet is connected
    const checkWalletConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length === 0) {
            // No accounts connected, redirect to home
            router.push("/")
            toast.error("Wallet not connected", {
              description: "Please connect your wallet to continue",
            })
          } else {
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
          router.push("/")
        }
      } else {
        // No ethereum object, redirect to home
        router.push("/")
      }
    }

    checkWalletConnection()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleOrderTypeChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      orderType: value as OrderType,
    }))
  }

  const validateInputs = (): boolean => {
    // Check for empty required fields
    if (!formState.amount || !formState.vtlMin || !formState.vtlMax) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields",
      })
      return false
    }

    // Check if amount is a valid integer
    if (!Number.isInteger(Number(formState.amount)) || Number(formState.amount) <= 0) {
      toast.error("Invalid amount", {
        description: "Amount must be a positive integer",
      })
      return false
    }

    // Check if VTL values are valid numbers
    if (isNaN(Number(formState.vtlMin)) || isNaN(Number(formState.vtlMax))) {
      toast.error("Invalid VTL range", {
        description: "VTL values must be valid numbers",
      })
      return false
    }

    // Check if min is less than max
    if (Number(formState.vtlMin) >= Number(formState.vtlMax)) {
      toast.error("Invalid VTL range", {
        description: "Minimum VTL must be less than maximum VTL",
      })
      return false
    }

    // Check collateral for borrow orders
    if (formState.orderType === "borrow") {
      if (!formState.collateral) {
        toast.error("Missing collateral", {
          description: "Collateral is required for borrow orders",
        })
        return false
      }

      if (!Number.isInteger(Number(formState.collateral)) || Number(formState.collateral) <= 0) {
        toast.error("Invalid collateral", {
          description: "Collateral must be a positive integer",
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletAddress) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to continue",
      })
      router.push("/")
      return
    }

    if (!validateInputs()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create order object with proper types
      const order: Order = {
        orderType: formState.orderType,
        amount: Number.parseInt(formState.amount),
        ...(formState.orderType === "borrow" && { collateral: Number.parseInt(formState.collateral) }),
        vtlRange: {
          min: Number(formState.vtlMin),
          max: Number(formState.vtlMax),
        },
        walletAddress,
        timestamp: Date.now(),
      }

      // Log the order data (in a real app, this would be sent to an API)
      console.log("Order created:", order)

      setIsSuccess(true)
      toast.success("Order created successfully", {
        description: `Your ${formState.orderType} order has been created.`,
      })

      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setFormState({
          orderType: "lend",
          amount: "",
          collateral: "",
          vtlMin: "",
          vtlMax: "",
        })
      }, 2000)
    } catch (error) {
      toast.error("Error creating order", {
        description: "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!walletAddress) {
    return (
      <Card className="border-gray-800 bg-gray-950 text-white shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <p className="text-center">Connecting to wallet...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-800 bg-gray-950 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-400">Create New Order</CardTitle>
        <CardDescription className="text-gray-400">
          Fill in the details to create a new {formState.orderType} order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="order-type" className="text-gray-300">
              Order Type
            </Label>
            <Tabs defaultValue={formState.orderType} className="w-full" onValueChange={handleOrderTypeChange}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="lend" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Lend
                </TabsTrigger>
                <TabsTrigger value="borrow" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Borrow
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">
              {formState.orderType === "lend" ? "Amount to Lend" : "Amount to Borrow"}
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="1" // Changed to 1 for integers
                min="1"
                placeholder="0"
                value={formState.amount}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                USDC
              </div>
            </div>
          </div>

          {formState.orderType === "borrow" && (
            <div className="space-y-2">
              <Label htmlFor="collateral" className="text-gray-300">
                Collateral Amount
              </Label>
              <div className="relative">
                <Input
                  id="collateral"
                  type="number"
                  step="1" // Changed to 1 for integers
                  min="1"
                  placeholder="0"
                  value={formState.collateral}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  ETH
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-300">Value to Loan (VTL) Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vtlMin" className="sr-only">
                  Minimum VTL
                </Label>
                <div className="relative">
                  <Input
                    id="vtlMin"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Min"
                    value={formState.vtlMin}
                    onChange={handleInputChange}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vtlMax" className="sr-only">
                  Maximum VTL
                </Label>
                <div className="relative">
                  <Input
                    id="vtlMax"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Max"
                    value={formState.vtlMax}
                    onChange={handleInputChange}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              The Value to Loan ratio determines the loan-to-value parameters for this order.
            </p>
          </div>

          <Button
            type="submit"
            className={`w-full ${formState.orderType === "lend" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Order Created
              </>
            ) : (
              "Create Order"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="border-t border-gray-800 bg-gray-900/50 flex justify-center">
        <p className="text-xs text-gray-400">NunyaXChange - All Rights Reserved.</p>
      </CardFooter>
    </Card>
  )
}
