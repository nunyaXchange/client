"use client"

import type React from "react"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type OrderType = "lend" | "borrow"

export default function OrderForm() {
  const [orderType, setOrderType] = useState<OrderType>("lend")
  const [amount, setAmount] = useState("")
  const [collateral, setCollateral] = useState("")
  const [vtlMin, setVtlMin] = useState("")
  const [vtlMax, setVtlMax] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate inputs
    if (!amount || !vtlMin || !vtlMax) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields",
      })
      setIsSubmitting(false)
      return
    }

    if (orderType === "borrow" && !collateral) {
      toast.error("Missing collateral", {
        description: "Collateral is required for borrow orders",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Log the order data (in a real app, this would be sent to an API)
      console.log({
        orderType,
        amount: Number.parseFloat(amount),
        ...(orderType === "borrow" && { collateral: Number.parseFloat(collateral) }),
        vtlRange: {
          min: Number.parseFloat(vtlMin),
          max: Number.parseFloat(vtlMax),
        },
      })

      setIsSuccess(true)
      toast.success("Order created successfully", {
        description: `Your ${orderType} order has been created.`,
      })

      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setAmount("")
        setCollateral("")
        setVtlMin("")
        setVtlMax("")
      }, 2000)
    } catch (error) {
      toast.error("Error creating order", {
        description: "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-gray-800 bg-gray-950 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-emerald-400">Create New Order</CardTitle>
        <CardDescription className="text-gray-400">
          Fill in the details to create a new {orderType} order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="order-type" className="text-gray-300">
              Order Type
            </Label>
            <Tabs defaultValue="lend" className="w-full" onValueChange={(value) => setOrderType(value as OrderType)}>
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
              {orderType === "lend" ? "Amount to Lend" : "Amount to Borrow"}
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                USDC
              </div>
            </div>
          </div>

          {orderType === "borrow" && (
            <div className="space-y-2">
              <Label htmlFor="collateral" className="text-gray-300">
                Collateral Amount
              </Label>
              <div className="relative">
                <Input
                  id="collateral"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={collateral}
                  onChange={(e) => setCollateral(e.target.value)}
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
                <Label htmlFor="vtl-min" className="sr-only">
                  Minimum VTL
                </Label>
                <div className="relative">
                  <Input
                    id="vtl-min"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Min"
                    value={vtlMin}
                    onChange={(e) => setVtlMin(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vtl-max" className="sr-only">
                  Maximum VTL
                </Label>
                <div className="relative">
                  <Input
                    id="vtl-max"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Max"
                    value={vtlMax}
                    onChange={(e) => setVtlMax(e.target.value)}
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
            className={`w-full ${orderType === "lend" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}
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
        <p className="text-xs text-gray-400">All orders are subject to market conditions and liquidity</p>
      </CardFooter>
    </Card>
  )
}
