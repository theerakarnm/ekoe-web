import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useActionData, useNavigation, useSubmit } from "react-router";
import { useCustomerAuthStore } from "~/store/customer-auth";
import { useCartStore } from "~/store/cart";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import type { ValidatedCart } from "~/lib/services/cart.service";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
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

interface CheckoutFormProps {
  isValidating: boolean;
  validationResult: ValidatedCart | null;
}

export function CheckoutForm({ isValidating, validationResult }: CheckoutFormProps) {
  const { user, profile, addresses, loadProfile, loadAddresses } = useCustomerAuthStore();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const submit = useSubmit();
  const actionData = useActionData<{ error?: string; code?: string; field?: string; details?: any }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = {
      ...data,
      items: JSON.stringify(
        items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }))
      ),
    };
    submit(formData, { method: "post" });
  };

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

  // Load profile and addresses on mount
  useEffect(() => {
    loadProfile();
    loadAddresses();
  }, [loadProfile, loadAddresses]);

  // Pre-fill form when profile or addresses are loaded
  useEffect(() => {
    if (user || profile || addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];

      // Pre-fill email from user
      if (user?.email) {
        form.setValue('email', user.email);
      }

      // Pre-fill name from profile or default address
      if (profile?.firstName || defaultAddress?.firstName) {
        form.setValue('firstName', profile?.firstName || defaultAddress?.firstName || '');
      }
      if (profile?.lastName || defaultAddress?.lastName) {
        form.setValue('lastName', profile?.lastName || defaultAddress?.lastName || '');
      }

      // Pre-fill phone from profile or default address
      if (profile?.phone || defaultAddress?.phone) {
        form.setValue('phone', profile?.phone || defaultAddress?.phone || '');
      }

      // Pre-fill address from default address
      if (defaultAddress) {
        form.setValue('country', defaultAddress.country || 'Thailand');
        form.setValue('address', defaultAddress.addressLine1 || '');
        form.setValue('apartment', defaultAddress.addressLine2 || '');
        form.setValue('city', defaultAddress.city || '');
        form.setValue('province', defaultAddress.province || 'Bangkok');
        form.setValue('postalCode', defaultAddress.postalCode || '');
        if (defaultAddress.company) {
          form.setValue('company', defaultAddress.company);
        }
      }

      // Pre-fill newsletter preference from profile
      if (profile?.newsletterSubscribed !== undefined) {
        form.setValue('newsletter', profile.newsletterSubscribed);
      }
    }
  }, [user, profile, addresses, form]);

  // Clear cart on successful order (when component unmounts after redirect)
  useEffect(() => {
    return () => {
      // This will run when navigating away from checkout
      if (navigation.state === "loading" && navigation.location?.pathname.includes("/order-confirmation")) {
        clearCart();
      }
    };
  }, [navigation, clearCart]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 py-8 relative">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-lg font-medium">Processing your order...</p>
              <p className="text-sm text-gray-600">Please do not close this page</p>
            </div>
          </div>
        )}
        {/* Error Display */}
        {actionData?.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Order Failed</AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p>{actionData.error}</p>
                {actionData.field && (
                  <p className="text-sm">
                    Issue with field: <strong>{actionData.field}</strong>
                  </p>
                )}
                {actionData.code && (
                  <p className="text-xs opacity-75">Error code: {actionData.code}</p>
                )}
                {actionData.details && typeof actionData.details === 'object' && (
                  <div className="mt-2 text-sm space-y-1">
                    {Object.entries(actionData.details).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </p>
                    ))}
                  </div>
                )}
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  disabled={isSubmitting}
                >
                  Retry Order
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Contact Section */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Contact</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} name="email" className="h-12" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value} name="country">
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
                    <Input placeholder="First name" {...field} name="firstName" className="h-12" />
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
                    <Input placeholder="Last name" {...field} name="lastName" className="h-12" />
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
                  <Input placeholder="Company (optional)" {...field} name="company" className="h-12" />
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
                  <Input placeholder="House number and street name" {...field} name="address" className="h-12" />
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
                  <Input placeholder="Apartment, suite, etc. (optional)" {...field} name="apartment" className="h-12" />
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
                    <Input placeholder="City" {...field} name="city" className="h-12" />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} name="province">
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
                    <Input placeholder="Postal code" {...field} name="postalCode" className="h-12" />
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
                  <Input placeholder="Phone" {...field} name="phone" className="h-12" />
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

        <Button
          type="submit"
          className="w-full h-14 bg-black text-white text-lg hover:bg-gray-800 uppercase tracking-widest"
          disabled={isValidating || isSubmitting || (validationResult !== null && !validationResult.isValid)}
        >
          {isSubmitting ? 'Processing Order...' : isValidating ? 'Validating Cart...' : 'Pay Now'}
        </Button>

        <p className="text-[10px] text-gray-400 text-center mt-4">
          เราใช้ข้อมูลส่วนตัวของคุณเพื่อจัดการคำสั่งซื้อ, เข้าถึงหน้าต่างๆ ในเว็บไซต์ รวมถึงจุดประสงค์อื่นๆ ตาม privacy policy
        </p>
      </form>
    </Form>
  );
}
