'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface AddClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddClientModal({ open, onOpenChange }: AddClientModalProps) {
  const [date, setDate] = useState<Date>()
  const [appDate, setAppDate] = useState<Date>()

  // Sample data - would come from API in production
  const servers = [
    { id: '1', name: 'Server 1' },
    { id: '2', name: 'Server 2' },
  ]

  const plans = [
    { id: '1', name: 'Basic Plan' },
    { id: '2', name: 'Premium Plan' },
  ]

  const paymentMethods = [
    { id: '1', name: 'PIX' },
    { id: '2', name: 'Credit Card' },
  ]

  const devices = [
    { id: '1', name: 'Android Box' },
    { id: '2', name: 'Smart TV' },
  ]

  const apps = [
    { id: '1', name: 'IPTV App' },
    { id: '2', name: 'VOD App' },
  ]

  const sources = [
    { id: '1', name: 'Facebook' },
    { id: '2', name: 'Instagram' },
  ]

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Add New Client"
      maxWidth="3xl"
    >
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Data</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="info">Additional Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Full name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Username" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone1">Primary Phone</Label>
              <Input id="phone1" placeholder="+1 (555) 000-0000" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone2">Secondary Phone</Label>
              <Input id="phone2" placeholder="+1 (555) 000-0000" />
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input id="dueTime" type="time" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional notes..." />
          </div>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="server">Server</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select server" />
                </SelectTrigger>
                <SelectContent>
                  {servers.map(server => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="screens">Number of Screens</Label>
              <Input id="screens" type="number" min="1" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input id="totalCost" type="number" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credit">Credit</Label>
              <Input id="credit" type="number" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pix">PIX</Label>
              <Input id="pix" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Add Payment</Label>
              <RadioGroup defaultValue="yes">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="addPayment-yes" />
                  <Label htmlFor="addPayment-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="addPayment-no" />
                  <Label htmlFor="addPayment-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Send Message</Label>
              <RadioGroup defaultValue="yes">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="sendMessage-yes" />
                  <Label htmlFor="sendMessage-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="sendMessage-no" />
                  <Label htmlFor="sendMessage-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referredBy">Referred By</Label>
              <Input id="referredBy" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device">Device</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="app">Application</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {apps.map(app => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>App Expiration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !appDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appDate ? format(appDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={appDate}
                    onSelect={setAppDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="m3u">M3U Link</Label>
              <Input id="m3u" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mac">MAC Address</Label>
              <Input id="mac" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deviceKey">Device Key/OTP Code</Label>
              <Input id="deviceKey" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" type="date" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button>Save Client</Button>
      </div>
    </Modal>
  )
}