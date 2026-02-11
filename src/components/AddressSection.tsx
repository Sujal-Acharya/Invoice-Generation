import { Address } from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressSectionProps {
  title: string;
  data: Address;
  onChange: (field: string, value: string) => void;
  showContactPerson?: boolean;
}

const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function AddressSection({ title, data, onChange, showContactPerson }: AddressSectionProps) {
  const gstinValid = !data.gstin || gstinPattern.test(data.gstin);

  return (
    <div className="space-y-3">
      <h3 className="invoice-section-title">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <Label htmlFor={`${title}-company`} className="text-xs font-medium text-muted-foreground">Company Name *</Label>
          <Input
            id={`${title}-company`}
            value={data.companyName}
            onChange={e => onChange('companyName', e.target.value)}
            placeholder="Company name"
            className="mt-1"
            required
          />
        </div>
        {showContactPerson && (
          <div className="md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">Contact Person</Label>
            <Input
              value={data.contactPerson || ''}
              onChange={e => onChange('contactPerson', e.target.value)}
              placeholder="Contact person"
              className="mt-1"
            />
          </div>
        )}
        <div className="md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Address *</Label>
          <Input
            value={data.address}
            onChange={e => onChange('address', e.target.value)}
            placeholder="Street address"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">City *</Label>
          <Input
            value={data.city}
            onChange={e => onChange('city', e.target.value)}
            placeholder="City"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">State *</Label>
          <Input
            value={data.state}
            onChange={e => onChange('state', e.target.value)}
            placeholder="State"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Country</Label>
          <Input
            value={data.country}
            onChange={e => onChange('country', e.target.value)}
            placeholder="Country"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">GSTIN *</Label>
          <Input
            value={data.gstin}
            onChange={e => onChange('gstin', e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
            className={`mt-1 ${!gstinValid ? 'border-destructive' : ''}`}
            maxLength={15}
            required
          />
          {!gstinValid && (
            <p className="text-xs text-destructive mt-1">Invalid GSTIN format</p>
          )}
        </div>
      </div>
    </div>
  );
}
