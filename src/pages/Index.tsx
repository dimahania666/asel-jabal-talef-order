import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    wilaya: "",
    mairie: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getPricePerKg = () => {
    if (quantity >= 30) return null; // Special case for 30+ kg
    if (quantity >= 10) return 4500;
    return 5000;
  };

  const getTotalPrice = () => {
    const pricePerKg = getPricePerKg();
    return pricePerKg ? pricePerKg * quantity : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const pricePerKg = getPricePerKg();
      const totalPrice = getTotalPrice();

      const { error } = await supabase.from("orders").insert([
        {
          full_name: formData.fullName,
          wilaya: formData.wilaya,
          mairie: formData.mairie,
          phone_number: formData.phone,
          exact_address: formData.address,
          quantity_kg: quantity,
          price_per_kg: pricePerKg || 0,
          total_price: totalPrice,
        },
      ]);

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد الطلب",
      });

      // Reset form
      setFormData({
        fullName: "",
        wilaya: "",
        mairie: "",
        phone: "",
        address: "",
      });
      setQuantity(1);
    } catch (error) {
      toast({
        title: "خطأ في إرسال الطلب",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              عسل حر طبيعي أصيل
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-4" dir="rtl">
              السلام عليكم أخي العزيز عندي عسل حر طبيعي أصيل كمية متوفرة
              <br />
              في بساتين الفواكه المتنوعة والكاليتوس والكروم والضرو والريحان وغيرها
              <br />
              بمنطقة جبلية بامتياز عين الكرمة ولاية الطارف
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="text-center">
                <Label className="text-lg font-semibold">الكمية المطلوبة (كيلوغرام)</Label>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Pricing Display */}
              <div className="text-center p-4 bg-muted rounded-lg">
                {quantity >= 30 ? (
                  <div>
                    <p className="text-lg font-bold text-primary">
                      للكميات أكبر من 30 كيلو
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      يرجى التواصل معنا مباشرة لتأكيد الطلب والسعر
                    </p>
                    <p className="text-lg font-semibold mt-2">
                      📞 0667312853
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg">
                      سعر الكيلو الواحد: <span className="font-bold">{getPricePerKg()} دج</span>
                    </p>
                    <p className="text-xl font-bold text-primary mt-2">
                      المجموع: {getTotalPrice()} دج
                    </p>
                    {quantity >= 10 && (
                      <p className="text-sm text-green-600 mt-1">
                        خصم خاص للكميات الكبيرة!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wilaya">الولاية *</Label>
                    <Input
                      id="wilaya"
                      value={formData.wilaya}
                      onChange={(e) => handleInputChange("wilaya", e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mairie">البلدية *</Label>
                    <Input
                      id="mairie"
                      value={formData.mairie}
                      onChange={(e) => handleInputChange("mairie", e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    placeholder="0667312853"
                  />
                </div>

                <div>
                  <Label htmlFor="address">العنوان الدقيق *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    dir="rtl"
                    rows={3}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    🚚 الشحن مجاني في جميع أنحاء الوطن
                    <br />
                    💰 الدفع عند الاستلام بعد فحص المنتج
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg"
                  disabled={isSubmitting || quantity >= 30}
                >
                  {isSubmitting ? "جاري إرسال الطلب..." : "أكد طلبي"}
                </Button>

                {quantity >= 30 && (
                  <p className="text-center text-sm text-muted-foreground">
                    للكميات الكبيرة يرجى الاتصال مباشرة: 0667312853
                  </p>
                )}
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
