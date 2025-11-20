import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { CreditCard, QrCode } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  newsletter: z.boolean(),
  country: z.string().min(1, "Country is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().min(1, "Phone is required"),
  paymentMethod: z.enum(["credit_card", "promptpay"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  securityCode: z.string().optional(),
  nameOnCard: z.string().optional(),
  billingSameAsShipping: z.boolean(),
});

export function CheckoutForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      newsletter: true,
      country: "Thailand",
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      apartment: "",
      city: "",
      province: "Bangkok",
      postalCode: "",
      phone: "",
      paymentMethod: "credit_card",
      billingSameAsShipping: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 py-8">
        {/* Contact Section */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Contact</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal text-gray-600">
                    Yes, I'd like to receive emails from Ekoe about product launches, promotions and offers
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Delivery Section */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Delivery</h2>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Country/Region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First name" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last name" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Company (optional)" {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="House number and street name" {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apartment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Apartment, suite, etc. (optional)" {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="City" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bangkok">Bangkok</SelectItem>
                      <SelectItem value="Chiang Mai">Chiang Mai</SelectItem>
                      <SelectItem value="Phuket">Phuket</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Postal code" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Phone" {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Payment Section */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Payment</h2>
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-0"
                  >
                    {/* Credit Card Option */}
                    <div className={`border rounded-t-md p-4 ${field.value === 'credit_card' ? 'bg-gray-50 border-black z-10' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <div className="flex-1 flex justify-between items-center">
                          <FormLabel htmlFor="credit_card" className="font-medium cursor-pointer">Credit card</FormLabel>
                          <div className="flex gap-1">
                            {/* Mock Card Icons */}
                            <div className="w-8 h-5 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center font-bold italic">VISA</div>
                            <div className="w-8 h-5 bg-red-500 rounded text-[8px] text-white flex items-center justify-center font-bold">MC</div>
                          </div>
                        </div>
                      </div>

                      {field.value === 'credit_card' && (
                        <div className="mt-4 space-y-4 pl-6">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <Input placeholder="Card number" {...field} className="h-12 bg-white" />
                                    <div className="absolute right-3 top-3 text-gray-400">
                                      <CreditCard size={20} />
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Expiration date (MM/YY)" {...field} className="h-12 bg-white" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="securityCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Security code" {...field} className="h-12 bg-white" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="nameOnCard"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Name on card" {...field} className="h-12 bg-white" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="billingSameAsShipping"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-normal text-gray-600">
                                    Use shipping address as billing address
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* PromptPay Option */}
                    <div className={`border border-t-0 rounded-b-md p-4 ${field.value === 'promptpay' ? 'bg-gray-50 border-black' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="promptpay" id="promptpay" />
                        <div className="flex-1 flex justify-between items-center">
                          <FormLabel htmlFor="promptpay" className="font-medium cursor-pointer">PromptPay QR Code</FormLabel>
                          <QrCode size={20} />
                        </div>
                      </div>
                      {field.value === 'promptpay' && (
                        <div className="mt-4 pl-6 text-sm text-gray-500">
                          After clicking "Pay Now", you will be redirected to PromptPay to complete your purchase securely.
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full h-14 bg-black text-white text-lg hover:bg-gray-800 uppercase tracking-widest">
          Pay Now
        </Button>

        <p className="text-[10px] text-gray-400 text-center mt-4">
          เราใช้ข้อมูลส่วนตัวของคุณเพื่อจัดการคำสั่งซื้อ, เข้าถึงหน้าต่างๆ ในเว็บไซต์ รวมถึงจุดประสงค์อื่นๆ ตาม privacy policy
        </p>
      </form>
    </Form>
  );
}
