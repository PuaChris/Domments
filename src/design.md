# Design Choices & Justification

# CommentList
## Why use an Array to hold all of the comments?
- Inside the array is a `Comment` object constructed by functions from `createCommentObj.js` 
- Each comment has an ID that can be searched for when saving or deleting that comment 
- It is unlikely for a user to have so many comments on their website, using an array to hold all of the comments and its operations when dealing with comments (add, save, delete, etc.) should not impact performance significantly compared to other options
- Considered having an object containing objects for faster lookup but implementation is a bit messy



# Comment

# Firestore
## Database Organization
> Document: A unit of data in Google's Firestore database \
> Collection: A group or "collection" of documents \
> Sub-Collection: Same as a Collection except a Document can point to a Sub-Collection

`Users` -> Top-level Collection \
`Websites` -> Sub-Collection under each `User` document \
`Comments` -> Sub-Collection under each `Website` document

Example:
- User1 is a document inside `Users` Collection
- User1 has two websites: www.google.com & www.facebook.com. These two websites are stored as documents inside a Sub-Collection called `Websites`
- Each website document will have a set of comments stored in their own Sub-Collection `Comments`
- Each comment will be a document stored inside `Comments`

Having `Users` as a top-level Collection is intuitive because each user will have their own websites they visit and respectively, their own comments they wish to save. It makes more sense on an organizational level to have the Sub-Collections `Websites` and `Comments` because each user will have their own websites they visited and commented, and all of the comments of each website can be retrieved easily. 