"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader, Sparkles, X } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateProfile } from "@/ai/flows/ai-profile-generator";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().max(500, "Description must be 500 characters or less."),
  interests: z.array(z.string()).max(10),
  hobbies: z.array(z.string()).max(10),
  likesDislikes: z.string().max(200),
  consentToMatch: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type TagInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
};

function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <Badge key={tag} variant="secondary" className="text-sm py-1">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-background/50 p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}


export function ProfileForm({ user }: { user: User }) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      description: user.preferences.description,
      interests: user.preferences.interests,
      hobbies: user.preferences.hobbies,
      likesDislikes: user.preferences.likesDislikes,
      consentToMatch: user.consentToMatch,
    },
  });
  
  const watchedInterests = form.watch('interests');
  const watchedHobbies = form.watch('hobbies');

  const handleGenerateProfile = async () => {
    const interests = form.getValues("interests").join(', ');
    const hobbies = form.getValues("hobbies").join(', ');
    const likesDislikes = form.getValues("likesDislikes");
    const prompt = `Interests: ${interests}. Hobbies: ${hobbies}. Likes and dislikes: ${likesDislikes}.`;

    setIsGenerating(true);
    try {
      const result = await generateProfile({ interests: prompt });
      form.setValue("description", result.profileDescription, { shouldValidate: true });
      toast({
        title: "Profile generated!",
        description: "Your new AI-powered profile description is ready.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your profile description.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
    toast({
      title: "Profile Updated!",
      description: "Your changes have been saved successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <div className="flex justify-between items-center mb-2">
            <FormLabel>Profile Description</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={handleGenerateProfile} disabled={isGenerating}>
              {isGenerating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate with AI
            </Button>
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
            )}
          />
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add an interest and press Enter"
                />
              </FormControl>
              <FormDescription>
                What topics are you passionate about?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hobbies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hobbies</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add a hobby and press Enter"
                />
              </FormControl>
              <FormDescription>
                How do you like to spend your free time?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="likesDislikes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Likes & Dislikes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Love spicy food, dislike slow walkers"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consentToMatch"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Interest-Based Matchmaking
                </FormLabel>
                <FormDescription>
                  Allow us to connect you with others who share similar interests.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit">Update Profile</Button>
      </form>
    </Form>
  );
}
