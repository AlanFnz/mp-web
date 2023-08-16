'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Separator } from '@/components/ui/Separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { UpdateCart } from '@/components/cart/UpdateCart';
import { Icons } from '@/components/icons';
import { CartLineItem } from '@/types';
import useStore from '@/state/slices/shopifySlice';
import { Spinner } from '@/components/ui/Spinner';

export function CartSheet() {
  const [displayedCount, setDisplayedCount] = useState(0);
  const isLoading = useStore((state) => state.loading);
  const selectCheckout = useCallback(
    (state: { checkout: any }) => state.checkout,
    []
  );
  const checkout = useStore(selectCheckout);
  const cartLineItems: CartLineItem[] = checkout?.lineItems || [];

  const itemCount = cartLineItems.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  const cartTotal = cartLineItems.reduce(
    (total, item) =>
      total + Number(item.quantity) * Number(item.variant.price.amount),
    0
  );

  useEffect(() => {
    setDisplayedCount(itemCount);
  }, [itemCount]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label='Cart'
          variant='outline'
          size='icon'
          className='relative'
        >
          {displayedCount > 0 && (
            <Badge
              variant='secondary'
              className='absolute -right-2 -top-2 h-6 w-6 rounded-full p-2'
            >
              {displayedCount}
            </Badge>
          )}
          <Icons.cart className='h-4 w-4' aria-hidden='true' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
        <SheetHeader className='px-1'>
          <SheetTitle>
            Cart {displayedCount > 0 && `(${displayedCount})`}
          </SheetTitle>
        </SheetHeader>
        <Separator />
        {displayedCount > 0 ? (
          <>
            <div
              className={`flex flex-1 flex-col gap-5 overflow-hidden ${
                isLoading ? 'filter blur-sm' : ''
              }`}
            >
              <ScrollArea className='h-full'>
                <div className='flex flex-col gap-5 pr-6'>
                  {cartLineItems.map((item) => (
                    <div key={item.id} className='space-y-3'>
                      <div className='flex items-center space-x-4'>
                        <div className='relative h-16 w-16 overflow-hidden rounded'>
                          {item?.variant?.image.src ? (
                            <Image
                              src={
                                item?.variant?.image.src ??
                                '/images/product-placeholder.webp'
                              }
                              alt={item?.variant?.image.altText ?? item.title}
                              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                              fill
                              className='absolute object-cover'
                              loading='lazy'
                            />
                          ) : (
                            <div className='flex h-full items-center justify-center bg-secondary'>
                              <Icons.placeholder
                                className='h-4 w-4 text-muted-foreground'
                                aria-hidden='true'
                              />
                            </div>
                          )}
                        </div>
                        <div className='flex flex-1 flex-col gap-1 self-start text-sm'>
                          <span className='line-clamp-1'>{item.title}</span>
                          <span className='line-clamp-1 text-muted-foreground'>
                            {formatPrice(item.variant.price.amount)} x{' '}
                            {item.quantity} ={' '}
                            {formatPrice(
                              (
                                Number(item.variant.price.amount) *
                                Number(item.quantity)
                              ).toFixed(2)
                            )}
                          </span>
                          <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
                            {`${item.variant.title} ${
                              item.variant.weight && item.variant.weightUnit
                                ? `/ ${item.variant.weight} ${item.variant.weightUnit}`
                                : ''
                            }`}
                          </span>
                        </div>
                        <UpdateCart cartLineItem={item} />
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div
              className={`grid gap-1.5 pr-6 text-sm ${
                isLoading ? 'filter blur-sm' : ''
              }`}
            >
              <Separator className='mb-2' />
              <div className='flex'>
                <span className='flex-1'>Subtotal</span>
                <span>{formatPrice(cartTotal.toFixed(2))}</span>
              </div>
              <div className='flex'>
                <span className='flex-1'>Shipping</span>
                <span>Free</span>
              </div>
              <div className='flex'>
                <span className='flex-1'>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator className='mt-2' />
              <div className='flex'>
                <span className='flex-1'>Total</span>
                <span>{formatPrice(cartTotal.toFixed(2))}</span>
              </div>
              <SheetFooter className='mt-1.5'>
                <Button
                  aria-label='Proceed to checkout'
                  size='sm'
                  className='w-full'
                >
                  Proceed to Checkout
                </Button>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className='flex h-full flex-col items-center justify-center space-y-2'>
            <Icons.cart
              className='h-12 w-12 text-muted-foreground'
              aria-hidden='true'
            />
            <span className='text-lg font-medium text-muted-foreground'>
              Your cart is empty
            </span>
          </div>
        )}
        {isLoading ? (
          <div className='absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center'>
            <Spinner />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
